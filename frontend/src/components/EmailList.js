import React, { useEffect, useState } from "react";

import { Box, Flex, Text } from "../styles";

const EmailList = ({ emails = [] }) => {
    return emails.map((email, idx) => (
        <Box key={idx}>
            <Text>Cluster: {email.cluster_label}</Text>
            <Text>{email.body}</Text>
        </Box>
    ));
};

export default EmailList;
