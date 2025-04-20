import { CircularProgress } from "@mui/material";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-20">
      <CircularProgress />
    </div>
  );
};

export default Loader;
