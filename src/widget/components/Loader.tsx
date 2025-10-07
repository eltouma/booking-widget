import type { CSSProperties } from 'react';
import { ClipLoader } from 'react-spinners';

const override: CSSProperties = {
  display: "block",
  marginLeft: "20px",
  borderColor: "#bdc6d1",
};

function Loader({ loading }: { loading: boolean }) {
  return (
      <ClipLoader
        color="#bdc6d1"
        loading={loading}
        cssOverride={override}
        speedMultiplier={0.6} 
        size={25}
        aria-label="Loading Spinner"
      />
  );
}

export default Loader;
