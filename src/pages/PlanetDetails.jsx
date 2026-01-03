import { useParams } from "react-router-dom";

export default function PlanetDetails() {
  const { id } = useParams();
  return (
    <div style={{ padding: 24 }}>
      <h1>Planet Details</h1>
      <p>Planet: {id}</p>
    </div>
  );
}
