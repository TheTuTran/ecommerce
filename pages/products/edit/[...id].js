import Layout from "@/components/Layout";
import { useEffect } from "react";

export default function EditProductPage() {
    const router = useRouter();
    const { id } = router.query;
    useEffect(() => {
        axios.get('/api/products?id='+id).then(response=> {
            console.log(response.data);
        });
    }, []);

    return (
        <Layout>
            edit product form here
        </Layout>
    )
}