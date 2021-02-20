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
export function getDepartmentID(department){
  for(let i = 0; i<departments.length;i++){
    if(departments[i]==department){
      return i;
    }
  }
  return -1;
}
export function getDepartmentArray(){
  return departments;
}

export default function(departmentID) {
  if (departmentID < departments.length) {
    return departments[departmentID];
  } else {
    return "ABC"
  }
}