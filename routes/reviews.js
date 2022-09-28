const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const { reviewSchema } = require('../schemas');


router.get('/', catchAsync(async (req, res) => {
    const reviews = await Review.find({});
    let averageRate = 0;
    if (reviews.length) {
        for (let i of reviews) {
            averageRate += i.rate;
        }
        averageRate = averageRate / reviews.length;
    }
    averageRate = Math.ceil(averageRate)
    reviews.reverse();
    currentUser = req.session.user_id;
    res.render('reviews', { reviews, averageRate, currentUser });
}));


router.put('/', catchAsync(async (req, res) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        // throw new ExpressError(msg, 400);
        req.flash('error', msg);
        res.redirect('/reviews')

    } else {
        const review = new Review(req.body.review);
        await review.save();
        req.flash('success', 'Review added successfully! Thank You :)');
        res.redirect(`/reviews`);
    }
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    req.flash('success', 'Review deleted successfully');
    res.redirect('/reviews')
}));
module.exports = router;