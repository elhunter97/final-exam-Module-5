import { useEffect, useState } from "react";
import * as productService from "../service/ProductService";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";

function ProductLists() {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState([]);
    const [noResults, setNoResults] = useState(false);

    useEffect(() => {
        getAllData(name, categoryId);
    }, [name, categoryId]);

    const getAllData = async (name, categoryId) => {
        let productRes = await productService.getAllProducts(name, categoryId);
        let categoryRes = await productService.getAllCategories();

        productRes.sort((a, b) => a.name.localeCompare(b.name));

        const combinedData = productRes.map(product => {
            const category = categoryRes.find(c => c.categoryId === product.categoryId);
            return {
                ...product, categoryName: category ? category.name : 'Không xác định'
            };
        });

        setProducts(combinedData);
        setCategories(categoryRes);

        combinedData.length === 0 ? setNoResults(true) : setNoResults(false);
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    return (
        <div className="container mt-4">
            <h2 className="d-flex mb-3">Danh sách sản phẩm</h2>
            <div className="d-flex mb-3">
                <div className="d-flex flex-grow-1 align-items-center me-2">
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Nhập tên sản phẩm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <select className="form-control me-2" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                        <option value="">Chọn thể loại</option>
                        {categories.map(category => (
                            <option key={category.categoryId} value={category.categoryId}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <button className="btn btn-primary ms-2" onClick={() => getAllData(name, categoryId)}>Tìm kiếm</button>
                <Link to="/create" className="btn btn-primary ms-2">Thêm mới</Link>
            </div>
            {noResults ? (
                <div className="alert alert-warning" role="alert">
                    Không có thông tin sản phẩm này
                </div>
            ) : (
                <table className="table table-hover">
                    <thead className="thead-dark">
                    <tr>
                        <th scope="col">STT</th>
                        <th scope="col">Mã Sản Phẩm</th>
                        <th scope="col">Tên Sản Phẩm</th>
                        <th scope="col">Thể Loại</th>
                        <th scope="col">Số Lượng</th>
                        <th scope="col">Giá</th>
                        <th scope="col">Ngày Nhập</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map((item, index) => (
                        <tr key={item.productCode}>
                            <th scope="row">{index + 1}</th>
                            <td>{item.productCode}</td>
                            <td>{item.name}</td>
                            <td>{item.categoryName}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                            <td>{formatDate(item.dateOfAcquisition)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ProductLists;
