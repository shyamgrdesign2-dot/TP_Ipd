import React from "react";
import { Button, Result } from 'antd';
import { useNavigate } from "react-router-dom";

function ErrorFallback({ error, resetErrorBoundary }) {

    const navigate = useNavigate();

    return (
        <Result
            status="warning"
            title="There are some problems with your operation."
            subTitle={error.message && <span>Here's the error: {error.message}</span>}
            extra={[
                <Button type="primary" key="home" onClick={() => {
                    resetErrorBoundary()
                    navigate('/')
                }}>
                    Back Home
                </Button>,
                <Button key="close" onClick={resetErrorBoundary}>Close</Button>,
            ]}
        />
    );
}

export default React.memo(ErrorFallback);
