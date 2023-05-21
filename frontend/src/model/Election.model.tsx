enum ElectionState {
  upComing = 0,
  onGoing = 1,
  past = 2,
}

class Election {
  id: number;
  url: string;
  election_name: string;
  desc: string;
  start_time: string;
  end_time: string;
  readonly state: ElectionState;

  constructor(
    id: number,
    url: string,
    election_name: string,
    desc: string,
    start_time: string,
    end_time: string
  ) {
    this.id = id;
    this.url = url;
    this.election_name = election_name;
    this.desc = desc;
    this.start_time = start_time;
    this.end_time = end_time;

    const currentTime = new Date();
    const electionEndTime = new Date(end_time);
    const electionStartTime = new Date(start_time);
    const isElectionPast = electionEndTime.getTime() < currentTime.getTime();
    const isElectionFuture =
      electionStartTime.getTime() > currentTime.getTime();
    console.log(
      "[Election model] electionStartTime:",this.end_time ,
      electionStartTime.toString(), 
      "currentTime:",
      currentTime.toString()
    );

    if (isElectionPast) {
      this.state = ElectionState.past;
    } else if (isElectionFuture) {
        this.state = ElectionState.upComing;
    } else {
        this.state = ElectionState.onGoing;
    }
  }
}

export default Election;
