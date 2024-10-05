import { Profile_Puppeteer_Type } from "./Puppeteer_Connect_Profile";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface UpdateProfileType {
  profile: Profile_Puppeteer_Type;
  profileName: string;
}
interface State {
  chromeProfiles: { [key: string]: Profile_Puppeteer_Type };
}

interface Action {
  updateChromeProfiles: (update: UpdateProfileType[], action: "add" | "delete", removeProfiles: string[]) => void;
}
const useGetChromeProfiles = create<State & Action>()(
  devtools((set) => ({
    chromeProfiles: {},
    updateChromeProfiles: async (update, action, removeProfiles) => {
      if (action === "add") {
        update.forEach((item) => {
          set((state) => ({ chromeProfiles: { ...state.chromeProfiles, [item.profileName]: item.profile } }));
        });
      } else if (action === "delete") {
        set((state) => {
          const updatedProfiles = { ...state.chromeProfiles };
          removeProfiles.forEach((profileName) => {
            delete updatedProfiles[profileName]; // Remove the profile from the object
          });
          return { chromeProfiles: updatedProfiles }; // Update the state
        });
      }
    },
  }))
);
export {useGetChromeProfiles, UpdateProfileType}
