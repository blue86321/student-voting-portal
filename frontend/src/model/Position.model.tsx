interface Position {
    url: string;
    id: number;
    election_id: number;
    position_name: string;
    desc: string;
    max_votes_total: number;
    max_votes_per_candidate: number;
}

export default Position;