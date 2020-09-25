const graphQuery = `
{
  stopsByRadius(lat: 60.190978, lon: 24.948566, radius: 50) {
    edges {
      node {
        stop {
          code
          stoptimesForPatterns {
            stoptimes {
              headsign
              scheduledDeparture
              realtimeDeparture
              realtime
              trip {
                route {
                  shortName
                  alerts{
                    alertHeaderText
                    alertDescriptionText
                    alertUrl
                    effectiveStartDate
                    effectiveEndDate
                  }
                }
              }
              stop {
                vehicleMode
              }
            }
          }
        }
      }
    }
  }
}
`;

const getStopTimes = async () => {
  return await fetch("https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/graphql" },
    body: graphQuery,
  })
    .then((resp) => resp.json())
    .then((resp) => handleResponse(resp))
};

const handleResponse = (resp) => {
  const full = {};
  resp.data.stopsByRadius.edges.forEach((edge) =>
    handleStop(full, edge.node.stop)
  );
  Object.keys(full).forEach((key) => {
    full[key] = full[key].sort((a, b) =>
      a.scheduled > b.scheduled ? 1 : b.scheduled > a.scheduled ? -1 : 0
    );
  });
  return full;
};

const handleStop = (full, stop) => {
  const combined = combineAndCleanStoptimes(stop.stoptimesForPatterns);
  if (full[stop.code]) {
    full[stop.code] = full[stop.code].concat(combined);
  } else {
    full[stop.code] = combined;
  }
};

const combineAndCleanStoptimes = (patterns) => {
  const stopTimes = [];
  patterns.forEach((p) => {
    stopTimes.push(p.stoptimes);
  });
  const merged = [].concat.apply([], stopTimes);
  return merged.map((time) => ({
    headsign: time.headsign,
    scheduled: time.scheduledDeparture,
    realTime: time.realtimeDeparture,
    parsedScheduled: parseStoptime(time.scheduledDeparture),
    parsedReal: parseStoptime(time.realtimeDeparture),
    real: time.realtime,
    shortName: time.trip.route.shortName,
    alerts: time.trip.route.alerts,
    vehicle: time.stop.vehicleMode,
  }));
};

const parseStoptime = (time) => {
  const date = new Date();
  date.setHours(0, 0, time, 0);
  return `${date
    .getHours()
    .toString()
    .padStart(2, "0")}.${date.getMinutes().toString().padStart(2, "0")}`;
};

export default getStopTimes;