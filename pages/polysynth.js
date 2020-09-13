// The bulk of this WebMIDI logic was 
// adapted from webmidi-examples.glitch.me.
// Thanks Monica (@notwaldorf)!

import {
  useState,
  useEffect
} from 'react'
import Head from 'next/head'
import DefaultHead from 'components/DefaultHead'

// This function was fun to come up with
const midiKeyToNote = key => {
  let note = null
  const octave = parseInt(key / 12 - 1)
  switch (key % 12) {
    case 0:
      note = 'C'
      break;
    case 1:
      note = 'C#'
      break;
    case 2:
      note = 'D'
      break;
    case 3:
      note = 'D#'
      break;
    case 4:
      note = 'E'
      break;
    case 5:
      note = 'F'
      break;
    case 6:
      note = 'F#'
      break;
    case 7:
      note = 'G'
      break;
    case 8:
      note = 'G#'
      break;
    case 9:
      note = 'A'
      break;
    case 10:
      note = 'A#'
      break;
    case 11:
      note = 'B'
      break;
    default:
      throw new Error('[key-to-note] Unknown key number detected')
      break;
  }
  return note.concat(`${octave}`)
}

export default function PolySynthPage({ }) {
  const [machineOn, setMachineOnState] = useState(false)
  const [synth, setSynth] = useState(null)
  const [notesOn, setNotesOn] = useState([])
  const [midiContext, setMidiContext] = useState(null)
  const [midiInputDevices, setInputDevices] = useState([])
  //const [midiOutputDevices, setOutputDevices] = useState([])
  useEffect(() => {
    const onClientLoaded = async () => {
      // request access to MIDI APIs
      try {
        console.log('[client-load] Asking for permission to access MIDI services')
        const midiAccess = await navigator.requestMIDIAccess()
        midiAccess.addEventListener('statechange', (e) => setMidiContext(e.target))
        setMidiContext(midiAccess)
      } catch {
        console.error('[client-load] Cant access MIDI!')
      }
    }
    onClientLoaded()
  }, [])

  const onMidiMessageReceived = midiMessageEvent => {
    // MIDI commands we care about. See
    // http://webaudio.github.io/web-midi-api/#a-simple-monophonic-sine-wave-midi-synthesizer.
    const NOTE_ON = 9
    const NOTE_OFF = 8

    const cmd = midiMessageEvent.data[0] >> 4
    const pitch = midiMessageEvent.data[1]
    const velocity = (midiMessageEvent.data.length > 2) ? midiMessageEvent.data[2] : 1
    const note = midiKeyToNote(pitch)

    // Behave depending on whether a MIDI controller's key was pressed down or lifted up
    // Note that not all MIDI controllers send a separate NOTE_OFF command for every NOTE_ON.
    const keyUp = cmd === NOTE_OFF || (cmd === NOTE_ON && velocity === 0)
    const keyDown = cmd === NOTE_ON
    if (keyUp) {
      if (machineOn) {
        // if this note is on, then turn it off by deleting it from the notesOn list
        console.log(`[on-midi-receive] turning ${midiMessageEvent.srcElement.name}'s ${note} off`)
        // stop playing the note
        synth.triggerRelease(note)
        // delete note from notesOn
        setNotesOn(notesOn.filter(onNote => onNote !== note))
      }
    } else if (keyDown) {
      console.log(`[on-midi-receive] turning ${midiMessageEvent.srcElement.name}'s ${note} on`)
      if (machineOn) {
        // play the note
        synth.triggerAttack(note)
        // add note to notesOn
        setNotesOn([...notesOn, note])
      }
    } else {
      throw new Error('[on-midi-receive] Unknown key press state')
    }
  }

  // On changes (connect/disconnect) to the midi context,
  // keep track of which devices are available
  useEffect(() => {
    if (midiContext !== null && synth !== null) {
      console.log('[on-midi-ctx-change] getting input devices')
      const inputs = midiContext.inputs.values()
      for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
        const inputDevice = input.value
        inputDevice.addEventListener('midimessage', onMidiMessageReceived)
        setInputDevices([...midiInputDevices, inputDevice])
        console.log(`[on-midi-ctx-change] Added ${inputDevice.name} as input device`)
      }
      /*
      console.log('[on-midi-ctx-change] getting output devices')
      const outputs = midiContext.outputs.values()
      for (let output = outputs.next(); output && !output.done; output = outputs.next()) {
        const outputDevice = output.device
        setOutputDevices([...midiOutputDevices, outputDevice])
        console.log(`[on-midi-ctx-change] Added ${outputDevice.name} as output device`)
      }
      */
    }
  }, [midiContext, synth])



  return (
    <>
      <DefaultHead
        title="Polysynth"
        description="A MIDI-friendly polyphonic synthesizer right in your browser!"
      />
      <Head>
        <script type="text/javascript" src="/js/tone.js"></script>
      </Head>
      <div className="h-screen px-5 lg:px-36 overflow-hidden">
        <h1 className="my-2">Polysynth</h1>
        <p className="lg:w-1/2">
          Connect a MIDI controller and jam! Just make sure to turn this machine on first.
        </p>
        <div className="block mx-auto my-48 lg:my-32 text-center" onClick={() => {
          setMachineOnState(!machineOn)
          const newSynth = new window.Tone.PolySynth(window.Tone.Synth).toDestination()
          setSynth(newSynth)
        }}>
          <svg className="block mx-auto my-2" width="128" height="128" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="128" cy="128" r="113" stroke="black" stroke-width="30" />
            {machineOn && <circle cx="128" cy="128" r="87.5" fill="#FF0000" stroke="black" />}
          </svg>
          <span className="font-bold text-2xl lg:text-6xl">{machineOn ? 'ON' : 'OFF'}</span>
        </div>
        {/*
        <svg className="block w-full lg:w-1/2 mx-auto" viewBox="0 0 3122 1442" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.5" y="0.5" width="445" height="1441" fill={"white"} stroke="black" />
          <rect x="446.5" y="0.5" width="445" height="1441" fill="white" stroke="black" />
          <rect x="892.5" y="0.5" width="445" height="1441" fill="white" stroke="black" />
          <rect x="1338.5" y="0.5" width="445" height="1441" fill="white" stroke="black" />
          <rect x="1784.5" y="0.5" width="445" height="1441" fill="white" stroke="black" />
          <rect x="2230.5" y="0.5" width="445" height="1441" fill="white" stroke="black" />
          <rect x="2676.5" y="0.5" width="445" height="1441" fill="white" stroke="black" />
          <rect x="285" width="321" height="820" fill="black" />
          <rect x="731" width="321" height="820" fill="black" />
          <rect x="1623" width="321" height="820" fill="black" />
          <rect x="2070" width="321" height="820" fill="black" />
          <rect x="2515" width="321" height="820" fill="black" />
        </svg>
        */}
      </div>
    </>
  )
}