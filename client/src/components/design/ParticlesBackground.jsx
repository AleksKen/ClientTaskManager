import {useCallback} from 'react';
import Particles from 'react-tsparticles';
import {loadFull} from 'tsparticles';

const ParticlesBackground = () => {
    const particlesInit = useCallback(async (engine) => {
        await loadFull(engine);
    }, []);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
                fullScreen: {enable: false},
                background: {color: {value: "#0f1a40"}},
                particles: {
                    number: {value: 100, density: {enable: true, value_area: 800}},
                    color: {value: "#165dfb"},
                    links: {
                        enable: true,
                        color: "#ffffff",
                        distance: 150,
                        opacity: 0.5,
                        width: 1,
                    },
                    move: {enable: true, speed: 1.2},
                    size: {value: 3},
                    opacity: {value: 0.6},
                },
                interactivity: {
                    events: {
                        onClick: {
                            enable: true,
                            mode: "push",
                        },
                        onHover: {
                            enable: true,
                            mode: "repulse",
                        },
                        resize: true,
                    },
                    modes: {
                        push: {
                            quantity: 4,
                        },
                        repulse: {
                            distance: 40,
                            duration: 0.4,
                        },
                    },
                },
            }}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
            }}
        />
    );
};

export default ParticlesBackground;
