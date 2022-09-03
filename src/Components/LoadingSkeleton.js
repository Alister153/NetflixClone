import Skeleton from "@mui/material/Skeleton";

function LoadingSkeleton(props) {
  return (
    <div className="flex overflow-hidden">
      {Array(props.number)
        .fill(1)
        .map((i) => {
          return (
            <div className="flex m-1">
              <Skeleton
                className="skeleton"
                sx={{ bgcolor: "grey.900" }}
                variant="rectangular"
                animation="wave"
                width={props.width}
                height={props.height}
              ></Skeleton>
            </div>
          );
        })}
    </div>
  );
}

export default LoadingSkeleton;
