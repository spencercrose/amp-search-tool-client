
import { Box, Typography, List, ListItem, ListItemText, Link, Popover, Button, Grid, IconButton, CardContent, Card, CardHeader } from '@mui/material';
import { Close } from '@mui/icons-material';
import React from 'react';

// RetrieveAndGenerateResponse
//       sessionId: "STRING_VALUE", // required
//       output: { // RetrieveAndGenerateOutput
//         text: "STRING_VALUE", // required
//       },
//       citations: [ // Citations
//         { // Citation
//           generatedResponsePart: { // GeneratedResponsePart
//             textResponsePart: { // TextResponsePart
//               text: "STRING_VALUE",
//               span: { // Span
//                 start: Number("int"),
//                 end: Number("int"),
//               },
//             },
//           },
//           retrievedReferences: [ // RetrievedReferences
//             { // RetrievedReference
//               content: { // RetrievalResultContent
//                 text: "STRING_VALUE", // required
//               },
//               location: { // RetrievalResultLocation
//                 type: "S3" || "WEB" || "CONFLUENCE" || "SALESFORCE" || "SHAREPOINT", // required
//                 s3Location: { // RetrievalResultS3Location
//                   uri: "STRING_VALUE",
//                 },
//                 webLocation: { // RetrievalResultWebLocation
//                   url: "STRING_VALUE",
//                 },
//                 confluenceLocation: { // RetrievalResultConfluenceLocation
//                   url: "STRING_VALUE",
//                 },
//                 salesforceLocation: { // RetrievalResultSalesforceLocation
//                   url: "STRING_VALUE",
//                 },
//                 sharePointLocation: { // RetrievalResultSharePointLocation
//                   url: "STRING_VALUE",
//                 },
//               },
//               metadata: { // RetrievalResultMetadata
//                 "<keys>": "DOCUMENT_VALUE",
//               },
//             },
//           ],
//         },
//       ],
//       guardrailAction: "INTERVENED" || "NONE",
//     };


interface CitationProps {
    citation: Citation;
    title: string;
}

interface Citation {
    retrievedReferences: RetrievedReference[];
}

interface RetrievedReference {
    generatedResponsePart?: {
        textResponsePart: {
            text: string;
            span: {
                start: number;
                end: number;
            };
        };
    };
    content?: {
        text: string;
    };
    location?: {
        type: 'S3' | 'WEB' | 'CONFLUENCE' | 'SALESFORCE' | 'SHAREPOINT';
        [key: string]: any;
    };
    metadata?: {
        [key: string]: string;
    };
    signedUrl?: string;
}

export interface ResponseProps {
    sessionId: string;
    response: {
        output: {
            text: string;
        };
        citations: Citation[];
        guardrailAction: 'INTERVENED' | 'NONE';
    };
}

const CitationComponent: React.FC<CitationProps> = ({ citation, title }) => {
    const references = citation.retrievedReferences || [];
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Card sx={{ width: '100%' }}>
            <CardHeader sx={{ fontSize: '50%' }} title={title} />
      <CardContent>
        <Grid container spacing={2}>

                {(references || []).map((reference, index) => (

                    <Grid item rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Button sx={{ fontSize: '70%' }} variant="outlined" onClick={handleClick}>
                            View Reference {index + 1}
                        </Button>

                        <Popover
                            open={Boolean(anchorEl)}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                        >
                            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                cursor: 'pointer',
              }}
            >
              <Close />
            </IconButton>
                            <Box sx={{ padding: 2 }}>
                                <Typography variant="h6">Reference Details</Typography>
                                <Typography variant="body1">{reference?.content?.text || '-'}</Typography>
                                <List>
                                    {reference?.metadata && Object.keys(reference?.metadata).map((key) => (
                                        <ListItem key={key}>
                                            {
                                                reference?.metadata?.key &&
                                                <ListItemText primary={key} secondary={reference?.metadata[key]} />
                                            }
                                            <p>
                                                <Link href={reference.signedUrl} target="_blank" rel="noopener noreferrer">
                                                    View Original Source ({key})
                                                </Link>
                                            </p>
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        </Popover>
                    </Grid>

                ))}
            </Grid>
            </CardContent>
        </Card>
    );
};


const Response: React.FC<{ value: ResponseProps }> = ({ value }) => {
    console.log(value)
    return (
        <Box sx={{ padding: 1 }}>
            <Typography variant="body1">{value?.response?.output?.text || 'Sorry, I didn\'t understand that.'}</Typography>
            <List>
                {value?.response?.citations?.map((citation, index) => (
                    <ListItem key={index}>
                            <CitationComponent title={`Citation ${index + 1}`} citation={citation} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default Response;