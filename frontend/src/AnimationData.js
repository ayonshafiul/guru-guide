const pageAnimationVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      type: "spring",
      duration: 1,
    },
  },
};

export const slideAnimation = {
  hide: {
    visibility: "hidden",
  },
  show: {
    visibility: "visible",
  },
};

export default pageAnimationVariant;