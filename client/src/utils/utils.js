export function errorToString(err) {
  if (err === undefined || err === null) return "";
  if (typeof err === "string") {
    return err;
  }
  if (typeof err === "object" && "message" in err) {
    return String(err.message);
  }
  return String(err);
}
