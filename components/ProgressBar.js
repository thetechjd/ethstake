import React from 'react'

const ProgressBar = ({ bgcolor, progress, height, style }) => {

    const Parentdiv = {
        height: height,
        width: '100%',
        background: '#fafafa',
        borderRadius: 40,
        textAlign: 'center',
        justifyContent: 'center',
        position: 'relative',






    }

    const Childdiv = {
        height: '100%',
        width: `${progress}%`,
        backgroundColor: bgcolor,
        borderRadius: 40,
        textAlign: 'right'
    }

    const progresstext = {
        padding: 10,
        color: 'black',
        fontWeight: 900,
        fontFamily: style,
        justifyContent: 'center',
        textAlign: 'center'
    }

    return (
        <div style={Parentdiv}>
            <div style={Childdiv}>
                <span style={progresstext}>{`${progress}%`}</span>
            </div>
        </div>
    )
}

export default ProgressBar;