const pageAnimationVariant = {
    initial: {
        opacity: 0,
        scale: 0.8,
    }, 
    animate:  {
        opacity: 1,
        scale: 1,
        originX: 0,
        transition: {
            type:'spring',
            duration: 1,
        }
    }
}

export default pageAnimationVariant;