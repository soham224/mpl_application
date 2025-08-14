import React from "react";
import SecurityTable from "./components/SecurityTable";
import ErrorBoundary from '../../components/ErrorBoundary';
// import { SupervisorUIProvider } from "./SupervisorUIContext";
// import SecurityTable from "./components/SecurityTable";

export default function SecurityPage() {
    return (
        <ErrorBoundary>
            <div className="security-page">
                <SecurityTable />
            </div>
        </ErrorBoundary>
        // <SupervisorUIProvider>
        //     <SecurityTable />
        // </SupervisorUIProvider>
    );
}
