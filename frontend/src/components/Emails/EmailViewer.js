import React, { useEffect, useState } from "react";
import EmailList from "./EmailList";

import { Box } from "../../styles";

const EmailViewer = ({
    emailClusters,
    loading,
    refreshEmails,
    selectedCluster,
}) => {
    return (
        <Box>
            <EmailList
                emailClusters={emailClusters}
                loading={loading}
                refreshEmails={refreshEmails}
                selectedCluster={selectedCluster}
            />
        </Box>
    );
};

export default EmailViewer;
