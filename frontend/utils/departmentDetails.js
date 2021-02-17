const departments = [
  "",
  "CSE",
  "EEE",
  "ESS",
  "ARC",
  "MNS",
  "BBS",
  "PHR",
  "TBA",
]

export default function(departmentID) {
  if (departmentID < departments.length) {
    return departments[departmentID];
  } else {
    return "ABC"
  }
}