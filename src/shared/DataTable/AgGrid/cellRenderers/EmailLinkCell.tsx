import {createRenderer} from "@/shared/DataTable/AgGrid";

export const EmailLinkCell = createRenderer('emailLink', ({ value, fb = 'N/A' }: { value?: string, fb?: string }) =>
    value ? <a href={`mailto:${value}`}>{value}</a> : <span>{fb}</span>
);