const useFetch = () => {
  try {
    const fetchData = async (endpoint, method, body, token) => {
      const ifBodyNeeded = {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      // only attach body if not GET
      if (body && method !== "GET") {
        ifBodyNeeded.body = JSON.stringify(body);
      }

      const res = await fetch(import.meta.env.VITE_SERVER + endpoint, ifBodyNeeded);
      const data = await res.json();

      if (!res.ok) {
        if (data?.errors) {
          console.error("data.errors", data.errors[0].msg); //1st index of errors
          return { ok: false, msg: data.errors[0].msg };
        } else if (data.status === "error") {
          //server returns {status: "error", msg: ""}
          console.error("data.msg:", data.msg);
          return { ok: false, msg: data.msg };
        } else {
          console.error("final", data); //show raw parsed paylod
          return { ok: false, msg: "An unknown error has occurred, please try again later." };
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
