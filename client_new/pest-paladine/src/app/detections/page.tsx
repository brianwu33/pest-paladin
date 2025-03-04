// app/detections/page.tsx
// export default function DetectionsPage() {
//     return (
//       <div className="p-8">
//         <h1 className="text-3xl font-bold">Detections</h1>
//         <p>This is the Detections page.</p>
//       </div>
//     );
// }

import { DetectionData, columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<DetectionData[]> {
  // Fetch detection data from your API (replace this with actual API call)
  return [
    {
      id: "1",
      timestamp: "2025-03-02 10:15 AM",
      species: "Squirrel",
      duration: 15,
      cameraName: "Backyard Cam",
    },
    {
      id: "2",
      timestamp: "2025-03-02 11:30 AM",
      species: "Raccoon",
      duration: 30,
      cameraName: "Front Yard Cam",
    },
    {
      id: "3",
      timestamp: "2025-03-02 08:45 PM",
      species: "Deer",
      duration: 120,
      cameraName: "Driveway Cam",
    },
    {
      id: "4",
      timestamp: "2025-03-02 06:50 AM",
      species: "Fox",
      duration: 25,
      cameraName: "Garden Cam",
    },
    {
      id: "5",
      timestamp: "2025-03-02 02:10 AM",
      species: "Opossum",
      duration: 18,
      cameraName: "Garage Cam",
    },
    {
      id: "6",
      timestamp: "2025-03-01 09:25 PM",
      species: "Coyote",
      duration: 45,
      cameraName: "Forest Cam",
    },
    {
      id: "7",
      timestamp: "2025-03-01 11:05 PM",
      species: "Rabbit",
      duration: 10,
      cameraName: "Garden Cam",
    },
    {
      id: "8",
      timestamp: "2025-03-01 04:40 PM",
      species: "Hawk",
      duration: 5,
      cameraName: "Roof Cam",
    },
    {
      id: "9",
      timestamp: "2025-03-01 07:55 PM",
      species: "Skunk",
      duration: 20,
      cameraName: "Fence Cam",
    },
    {
      id: "10",
      timestamp: "2025-03-01 03:20 AM",
      species: "Bear",
      duration: 180,
      cameraName: "Mountain Cam",
    },
    {
      id: "11",
      timestamp: "2025-02-28 09:15 PM",
      species: "Coyote",
      duration: 35,
      cameraName: "Driveway Cam",
    },
    {
      id: "12",
      timestamp: "2025-02-28 07:10 AM",
      species: "Deer",
      duration: 90,
      cameraName: "Backyard Cam",
    },
    {
      id: "13",
      timestamp: "2025-02-28 01:45 AM",
      species: "Fox",
      duration: 22,
      cameraName: "Front Yard Cam",
    },
    {
      id: "14",
      timestamp: "2025-02-27 06:00 PM",
      species: "Eagle",
      duration: 8,
      cameraName: "Lake Cam",
    },
    {
      id: "15",
      timestamp: "2025-02-27 08:30 PM",
      species: "Raccoon",
      duration: 40,
      cameraName: "Trash Cam",
    },
  ];
}


export default async function MyDetectionsPage() {
  const data = await getData();

  return (
    <div className="container mx-auto max-w-8xl py-10">
      {/* <h1 className="text-2xl font-bold mb-6">All Detections</h1> */}
      <DataTable columns={columns} data={data} />
    </div>
  );
}
