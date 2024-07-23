import jwt from 'jsonwebtoken';
import staff from '../models/staff.js';
import company from '../models/company.js';

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {

        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
            if (err) return res.status(403).json({ msg: "login credentials not authentic", type: "UNAUTHORIZED", code: 606 });
            // check for the user and update the req.user data
            const user_data = await staff.findOne({ id: user?.id }, 'id email phone createdAt status previleges company office')
                .populate({ path: 'company', select: 'id name', transform: (doc, id) => doc == null ? { _id: id } : doc })
                .populate('office', 'id address');

            req.user = user_data._doc;
            // req.user===>{previlege id email phone company office}<===
            next();//continue execution after verification
        })
    } else {
        return res.status(403).json({ msg: "please login", type: "UNAUTHORIZED", code: 606 });
    }
}

export default verifyToken
// restrict access if user isn't an active staff of the company
export const isCompanyStaff = async (req, res, next) => {
    const company_data = await company.findOne({ id: req.user?.company?.id }, 'id name admins phone email');
    if (!company_data) return next(
        res.status(403).json({
            msg: "company NOT found",
            type: "NOT_EXIST",
            code: 603,
        })
    );
    if (
        (!req?.user?.previleges.includes(111)
            && !req?.user?.previleges.includes(112)
            && !req?.user?.previleges.includes(113))

        || req?.user?.company?.id !== company_data?.id

        // || ((
        //     req?.user?.previleges.includes(112)
        //     || req?.user?.previleges.includes(113)
        //     || req.user?.previleges.includes(114))
        //     && req.user?.status !== "active")
        ) {
        return next(
            res.status(403).json({
                msg: "you're NOT authorized to take this action, contact company Admin or an ACTIVE staff of the company",
                type: "NOT_AUTHORISED",
                code: 604,
            })
        )
    }

    req.req_company = company_data;
    next();
}

// restrict access if user isn't the admin of the company
export const isAdmin = async (req, res, next) => {

    const company_data = await company.findOne({ id: req.user?.company?.id }, 'id name admins phone email');
    if (!company_data) return next(
        res.status(403).json({
            msg: "company NOT found",
            type: "NOT_EXIST",
            code: 603,
        })
    );
    if (!req.user?.previleges.includes(111) || req.user?.company?.id !== company_data?.id) {
        return next(
            res.status(403).json({
                msg: "you're NOT authorized to take this action, contact the company Admin",
                type: "NOT_AUTHORISED",
                code: 604,
            })
        )
    }

    req.req_company = company_data;
    next();

}

// restrict access if user isn't the admin or stock-manager of the company
export const isAdminOrStockManager = async (req, res, next) => {
    const company_data = await company.findOne({ id: req.user?.company?.id }, 'id name admins phone email');
    if (!company_data) return next(
        res.status(403).json({
            msg: "company NOT found",
            type: "NOT_EXIST",
            code: 603,
        })
    );
    if ((!req.user?.previleges.includes(111) && !req.user?.previleges.includes(112))
        || req.user?.company?.id !== company_data?.id || req.user?.status !== "active") {
        return next(
            res.status(403).json({
                msg: "you're NOT authorized to take this action, contact the company Admin or the Stock manager",
                type: "NOT_AUTHORISED",
                code: 604,
            })
        )
    }

    req.req_company = company_data;
    next();

}

// restrict access if user isn't a stock-manager of the company
export const isStockManager = async (req, res, next) => {
    const company_data = await company.findOne({ id: req.user?.company?.id }, 'id name admins phone email');
    if (!company_data) return next(
        res.status(403).json({
            msg: "company NOT found",
            type: "NOT_EXIST",
            code: 603,
        })
    );
    if (!req.user?.previleges.includes(112) || req.user?.company?.id !== company_data?.id) {
        return next(
            res.status(403).json({
                msg: "you're NOT authorized to take this action, contact the stock manager",
                type: "NOT_AUTHORISED",
                code: 604,
            })
        )
    }

    req.req_company = company_data;
    next();

}

// restrict access if user isn't a store-manager of the company
export const isStoreManager = async (req, res, next) => {
    const company_data = await company.findOne({ id: req.user?.company?.id }, 'id name admins phone email');
    if (!company_data) return next(
        res.status(403).json({
            msg: "company NOT found",
            type: "NOT_EXIST",
            code: 603,
        })
    );

    if (!req.user?.previleges.includes(113) || req.user?.company?.id !== company_data?.id) {
        return next(
            res.status(403).json({
                msg: "you're NOT authorized to take this action, contact the store manager",
                type: "NOT_AUTHORISED",
                code: 604,
            })
        )
    }

    req.req_company = company_data;
    next();
}