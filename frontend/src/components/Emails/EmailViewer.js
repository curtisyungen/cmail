import React, { useEffect, useState } from "react";

import EmailList from "./EmailList";

const EmailViewer = ({
    emailClusters,
    loading,
    refreshEmails,
    selectedCluster,
}) => {
    return (
        <EmailList
            emailClusters={emailClusters}
            loading={loading}
            refreshEmails={refreshEmails}
            selectedCluster={selectedCluster}
        />
    );
};

export default EmailViewer;
