import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as productService from "../service/ProductService";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";

function ProductCreate() {
    const [form, setForm] = useState({
        productCode: "",
        name: "",
        categoryId: "",
        dateOfAcquisition: "",
        price: 0,
        quantity: 0,
        description: ""
    });
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await productService.getAllCategories();
                setCategories(response);
            } catch (error) {
                toast.error("Không thể tải thể loại sản phẩm");
            }
        };

        fetchCategories();
    }, []);

    const validationSchema = Yup.object({
        productCode: Yup.string()
            .matches(/^PROD-\d{4}$/, "Mã sản phẩm phải đúng định dạng PROD-XXXX")
            .required("Mã sản phẩm là bắt buộc"),
        name: Yup.string()
            .required("Tên sản phẩm là bắt buộc"),
        categoryId: Yup.string()
            .required("Thể loại sản phẩm là bắt buộc"),
        dateOfAcquisition: Yup.date()
            .max(new Date(), "Ngày nhập sản phẩm không được lớn hơn ngày hiện tại")
            .required("Ngày nhập sản phẩm là bắt buộc"),
        price: Yup.number()
            .positive("Giá phải là số dương")
            .required("Giá sản phẩm là bắt buộc"),
        quantity: Yup.number()
            .integer("Số lượng phải là số nguyên")
            .positive("Số lượng phải lớn hơn 0")
            .required("Số lượng sản phẩm là bắt buộc"),
        description: Yup.string()
            .required("Mô tả sản phẩm là bắt buộc")
    });

    const saveProduct = async (value) => {
        value.price = +value.price;
        value.quantity = +value.quantity;
        const isSuccess = await productService.saveProduct(value);
        if (isSuccess) {
            toast.success("Thêm mới thành công");
            navigate("/products");
        } else {
            toast.error("Thêm mới thất bại");
        }
    }

    const handleCancel = () => {
        navigate("/products");
    }

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h2>Thêm Sản Phẩm Mới</h2>
                    <Formik
                        initialValues={form}
                        onSubmit={saveProduct}
                        validationSchema={validationSchema}
                    >
                        <Form>
                            <div className="form-group mb-3">
                                <label htmlFor="productCode">Mã Sản Phẩm:</label>
                                <Field name="productCode" type="text" className="form-control"/>
                                <ErrorMessage name="productCode" component="p" className="text-danger"/>
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="name">Tên Sản Phẩm:</label>
                                <Field name="name" type="text" className="form-control"/>
                                <ErrorMessage name="name" component="p" className="text-danger"/>
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="categoryId">Thể Loại:</label>
                                <Field as="select" name="categoryId" className="form-control">
                                    <option value="">Chọn Thể Loại</option>
                                    {categories.map(category => (
                                        <option key={category.categoryId} value={category.categoryId}>{category.name}</option>
                                    ))}
                                </Field>
                                <ErrorMessage name="categoryId" component="p" className="text-danger"/>
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="dateOfAcquisition">Ngày Nhập Sản Phẩm:</label>
                                <Field name="dateOfAcquisition" type="date" className="form-control"/>
                                <ErrorMessage name="dateOfAcquisition" component="p" className="text-danger"/>
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="price">Giá:</label>
                                <Field name="price" type="number" className="form-control"/>
                                <ErrorMessage name="price" component="p" className="text-danger"/>
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="quantity">Số Lượng:</label>
                                <Field name="quantity" type="number" className="form-control"/>
                                <ErrorMessage name="quantity" component="p" className="text-danger"/>
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="description">Mô Tả Sản Phẩm:</label>
                                <Field name="description" as="textarea" rows="3" className="form-control"/>
                                <ErrorMessage name="description" component="p" className="text-danger"/>
                            </div>
                            <div className="d-flex justify-content-between">
                                <button type="submit" className="btn btn-primary">Thêm Mới</button>
                                <button type="button" className="btn btn-secondary" onClick={handleCancel}>Hủy</button>
                            </div>
                        </Form>
                    </Formik>
                </div>
            </div>
        </div>
    );
}

export default ProductCreate;
