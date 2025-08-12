interface School {
  name: string;
  address: string[];
  contacts: string[];
  imageId: string;
}

export const SCHOOLS: School[] = [
  {
    name: "Sri Petaling",
    address: [
      "2, Jalan 5/149B",
      "Taman Sri Endah",
      "Bandar Baru Sri Petaling",
      "57000 Kuala Lumpur",
    ],
    contacts: ["03 - 9056 4288", "010 - 221 2482"],
    imageId: "sri-petaling",
  },
  // {
  //   name: "Salak South Garden",
  //   address: ["K45 Jalan Cahaya 4", "Salak South Garden", "57100 Kuala Lumpur"],
  //   contacts: ["03 - 9059 2979", "010 - 221 2482"],
  //   imageId: "salak-south-garden",
  // },
  // {
  //   name: "Bukit Jalil",
  //   address: [
  //     "No 48 Jalan 17/155C",
  //     "Bandar Bukit Jalil",
  //     "57000 Kuala Lumpur",
  //   ],
  //   contacts: ["012 - 231 2408", "03 - 9545 1455"],
  //   imageId: "bukit-jalil",
  // },
  {
    name: "Puchong Utama",
    address: [
      "No 1, Jalan PU 3/1A",
      "Taman Puchong Utama",
      "47140 Puchong, Selangor",
    ],
    contacts: ["03 - 8066 9363", "012 - 218 0240"],
    imageId: "puchong",
  },
  {
    name: "Parklane OUG",
    address: [
      "D1-1-11 Jalan 1/152",
      "Taman OUG Parklane",
      "58200 Kuala Lumpur",
    ],
    contacts: ["012 - 386 1123", "03 - 7498 1905"],
    imageId: "parklane",
  },
];

export const SCHOOLS_NAMELIST = SCHOOLS.map((s) => s.name);
