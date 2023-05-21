import React from "react";

export const TitlePage = (props: { title: string }) => {
    return (
        <div className="mb-10 border-b-2">
            <span className="text-2xl font-bold">{props.title}</span>
        </div>
    );
}
