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
    const st = new Date(e.startTime)
    const et = new Date(e.endTime)
    this.startTime = st.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    this.endTime = et.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
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
