import { ElectionDetail, PositionDetail } from "../Interfaces/Election";
import { University } from "../Interfaces/User";
import Position from "./Position.model";

enum ElectionState {
  upComing = 0,
  onGoing = 1,
  past = 2,
}

class Election implements ElectionDetail {
  id: number;
  positions: Position[];
  university: University;
  electionName: string;
  electionDesc: string;
  startTime: string;
  endTime: string;
  startDate: Date;
  endDate: Date;

  constructor(e: ElectionDetail) {
    this.id = e.id;
    this.positions = e.positions.map((p) => {
      return new Position(p);
    });
    this.university = e.university;
    this.electionName = e.electionName;
    this.electionDesc = e.electionDesc;
    this.startDate = new Date(e.startTime);
    this.endDate = new Date(e.endTime);
    this.startTime = this.startDate.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    this.endTime = this.endDate.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
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

  get isDataCompleted(): boolean {
    if (this.positions.length === 0) {
      return false;
    }
    let isCompleted = true;
    this.positions.forEach((position) => {
      if (!position.isDataCompleted()) {
        isCompleted = false;
        return;
      }
    });
    return isCompleted;
  }
}

export default Election;
