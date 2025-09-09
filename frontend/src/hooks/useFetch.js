const useFetch = () => {
  try {
    const fetchData = async (endpoint, method, body, token) => {
      const res = await fetch(import.meta.env.VITE_SERVER + endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data?.errors) {
          console.error("data.errors", data.errors[0].msg); //1st index of errors
          throw data.errors[0].msg; //throw to caller
        } else if (data.status === "error") {
          //server returns {status: "error", msg: ""}
          console.error("data.msg:", data.msg); //log server msg
          throw data.msg; //throw to UI
        } else {
          console.error("final", data); //show raw parsed paylod
          throw "An unknown error has ocurred, please try again later.";
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
