
export default function ParkingPermitRequestLayout({
    children,
    modal,
}: Readonly<{
    children: React.ReactNode;
    modal: React.ReactNode;
}>) {
    return (
        <>
            {modal}
            {children}
        </>
    );
}