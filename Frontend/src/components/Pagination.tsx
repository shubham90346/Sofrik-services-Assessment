interface Props {
  page: number;
  setPage: (page: number) => void;
}

export const Pagination = ({ page, setPage }: Props) => (
  <div className="d-flex gap-2 mt-3">
    <button className="btn btn-outline-primary" onClick={() => setPage(Math.max(page-1,1))}>Prev</button>
    <span>Page {page}</span>
    <button className="btn btn-outline-primary" onClick={() => setPage(page+1)}>Next</button>
  </div>
);
