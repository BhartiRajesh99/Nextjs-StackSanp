import CreateNewPasswordPage from "./Reset";

function Reset({
  searchParams,
}: {
  searchParams: { userId: string; secret: string };
}) {
  const { userId, secret } = searchParams;
  return <CreateNewPasswordPage userId={userId} secret={secret} />;
}

export default Reset