class Election {
    constructor(attributes = {}) {
        this.defaults.electionID = attributes['electionID'];
    };
  get defaults() {
    return {
      electionID: "",
    };
  }
}

const election = new Election({
    electionID: "election1"
});

export default Election;