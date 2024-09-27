import { toast } from "sonner";

export async function getCurrentCoords() {
  return await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = pos.coords;
        let latitude = coords.latitude;
        let longitude = coords.longitude;
        resolve([latitude, longitude]);
      },
      (err) => {
        reject(
          toast.warning(
            "Please allow location access so that students nearby can find you.",
          ),
        );
      },
    );
  });
}
