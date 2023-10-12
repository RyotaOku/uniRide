import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: '/smartphoneApp/startPage',
      permanent: false,
    },
  };
};

export default function RedirectPage() {
  return null;
}
