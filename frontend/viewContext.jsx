import { createContext, useContext, useState } from "react";

// Create the Context
const ViewContext = createContext();

// Create a Provider
export function ViewProvider({ children }) {

    const [tableView, setTableView] = useState(true);
    const [newMedView, setNewMedView] = useState(false);
    const [medInfoView, setMedInfoView] = useState(false);

    const switchViewMode = (mode) => {
        switch (mode) {
            case "tableView":
                setTableView(true);
                setNewMedView(false);
                setMedInfoView(false);
                break;
            case "newMedView":
                setTableView(false);
                setNewMedView(true);
                setMedInfoView(false);
                console.log("adsiufgasdf");
                break;
            case "medInfoView":
                setTableView(false);
                setNewMedView(false);
                setMedInfoView(true);
                break;
            default:
                break;
        }
    };

    return (
        <ViewContext.Provider value={{ tableView, setTableView, newMedView, setNewMedView, medInfoView, setMedInfoView, switchViewMode }}>
            {children}
        </ViewContext.Provider>
    );
}

// Custom Hook
export function useView() {
    return useContext(ViewContext);
}