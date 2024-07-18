import { Watch } from "react-loader-spinner";

const Clock = () => {
  return (
    <Watch
      visible={true}
      height="40"
      width="40"
      radius="48"
      color="#747bff"
      ariaLabel="watch-loading"
    />
  );
};

export default Clock;
