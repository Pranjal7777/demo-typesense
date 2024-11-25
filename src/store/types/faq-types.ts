export type QaType = {
    _id: string;
    title: string;
    htmlContent: string;
    hasSubPoint: boolean;
    subPointsCount: number;
    link: string;
};

export type FaqResponse = {
    message: string;
    data: QaType[];
};
