const useFetch = () => {
  try {
    const fetchData = async (endpoint, method, body, token = null) => {
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

      const data = await res.json();

      if (!res.ok) {
        // flask {status: "error", msg: ""}
        if (data?.status === "error" && data?.msg) {
          console.error("data.msg:", data.msg);
          return { ok: false, msg: data.msg };
        } else {
          console.error("Unexpected error payload:", data); // debug fallback
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
