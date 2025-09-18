import { useGame } from "../context/GameContext";

const useFetch = () => {
  const {
    refreshToken,
    setAccessToken,
    setRefreshToken,
    setUsername,
    setJoinedSince,
  } = useGame();

  try {
    const fetchData = async (
      endpoint,
      method,
      body,
      token = null,
      retry = true
    ) => {
      const ifBodyNeeded = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      // add header if token exist
      if (token) {
        ifBodyNeeded.headers.Authorization = `Bearer ${token}`;
      }

      // only attach body if not GET
      if (body && method !== "GET") {
        ifBodyNeeded.body = JSON.stringify(body);
      }

      const res = await fetch(
        import.meta.env.VITE_SERVER + endpoint,
        ifBodyNeeded
      );

      let data = null;
      try {
        data = await res.json(); //safe parse
      } catch {
        data = null;
      }

      // try refresh if expire
      if (res.status === 401 && retry && refreshToken) {
        try {
          const refreshRes = await fetch(
            import.meta.env.VITE_SERVER + "/auth/refresh",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );

          const refreshData = await refreshRes.json();
          if (
            !refreshRes.ok ||
            !(refreshData.access || refreshData.access_token)
          ) {
            // refresh failed = reset states
            setAccessToken("");
            setRefreshToken("");
            setUsername("");
            setJoinedSince("");
            return { ok: false, msg: "Session expired, please log in again." };
          }

          //store new token
          setAccessToken(refreshData.access || refreshData.access_token);

          // retry with new token
          return fetchData(
            endpoint,
            method,
            body,
            refreshData.access || refreshData.access_token,
            false
          ); // try once only
        } catch {
          setAccessToken("");
          setRefreshToken("");
          setUsername("");
          setJoinedSince("");
          return { ok: false, msg: "Session expired, please log in again." };
        }
      }

      if (!res.ok) {
        // flask {status: "error", msg: ""}
        if (data?.status === "error" && data?.msg) {
          return { ok: false, msg: data.msg };
        } else {
          return {
            ok: false,
            msg: "An unknown error has occurred, please try again later.",
          };
        }
      }
      return data;
    };
    return fetchData;
  } catch (e) {
    console.error(e.message);
    return { ok: false, msg: "Data error" };
  }
};

export default useFetch;
