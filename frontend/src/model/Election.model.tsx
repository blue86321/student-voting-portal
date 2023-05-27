import { ElectionDetail, PositionDetail } from "../Interfaces/Election";
import { University } from "../Interfaces/User";

enum ElectionState {
  upComing = 0,
  onGoing = 1,
  past = 2,
}

class Election implements ElectionDetail {
  id: number;
  positions: PositionDetail[];
  university: University;
  electionName: string;
  electionDesc: string;
  startTime: string;
  endTime: string;

  constructor(
    e: ElectionDetail
  ) {
    this.id = e.id;
    this.positions = e.positions;
    this.university = e.university;
    this.electionName = e.electionName;
    this.electionDesc = e.electionDesc;
    this.startTime = e.startTime;
    this.endTime = e.endTime;
  }
  
  get state(): Number {
    const currentTime = new Date();
    const electionEndTime = new Date(this.endTime);
    const electionStartTime = new Date(this.startTime);
    const isElectionPast = electionEndTime.getTime() < currentTime.getTime();
    const isElectionFuture =
      electionStartTime.getTime() > currentTime.getTime();
    console.log(
      "[Election model] electionStartTime:",
      this.endTime,
      electionStartTime.toString(),
      "currentTime:",
      currentTime.toString()
    );

    if (isElectionPast) {
      return ElectionState.past;
    } else if (isElectionFuture) {
      return ElectionState.upComing;
    } else {
      return ElectionState.onGoing;
    }
  }
}

export default Election;
