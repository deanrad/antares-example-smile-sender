import { Antares } from '/imports/antares/main'
import { inAgencyRun } from 'meteor/deanius:antares'
import React from 'react'
import ReactDOM from 'react-dom'
import { mount } from 'react-mounter'

const WelcomeComponent = ({name}) => (
    <p>Ho Hum.</p>
);

// ensure we have a #react-root upon load
mount(()=>(<WelcomeComponent/>))

// A function that can be run in order to change the contents of react-root
// then change them back after a delay
const reactRenderer = ({ action }) => {
    const reactRoot = document.getElementById('react-root')
    ReactDOM.render(<div>Smile!</div>, reactRoot)

    // NOTE We can do better than this code which would need clearTimeouts
    // for certain cases. We'll use Observables with switchMap later..
    // But this'll work as long as we dont fire off events too quickly..
    setTimeout(() => {
        ReactDOM.render(React.createElement(WelcomeComponent), reactRoot)
    }, 2000)
}

// Only on the client side, we subscribe this renderer to run upon the 
// appropriate actions being received. 
// This differs from Epics
//  Epics: in response to actions, trigger additional actions within system
//  Renderers: in response to actions, cause changes outside our system
//    ^ Note a database or any external process is considered 'outside'
//      because it is fundamentally farther away / more expensive
inAgencyRun('client', () => {
    Antares.subscribeRenderer(reactRenderer, {
        xform: action$ =>
                action$.filter(({ action }) => action.type === 'surprise!')
    })
})
