/// <reference types="cypress" />

module.exports = (on, config) => {
  
    on("task", {
  
      setPgText: (val) => { return (pgText = val); },
  
      getPgText: () => { return pgText; },

      setForLater: (val) => { return (forLater = val); },
  
      getForLater: () => { return forLater; }
    });
  };