// middlewares/ProfileCompletion.middleware.js
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";

const isProfileCompleted = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user) throw new ApiError(404, "User not found");

    // Define REQUIRED fields
    const requiredFields = {
        // Personal Information (1, 2, 3, 4, 5, 6, 7, 8, 9)
        name: user.name,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        height: user.height,
        phoneNumber: user.phoneNumber,
        foodPreference: user.foodPreference,
        
        // Professional Information (12, 13, 14, 15)
        occupationType: user.occupationType,
        occupation: user.occupation,
        education: user.education,
        languagesKnown: user.languagesKnown, // array - needs at least 1
        
        // Family Information (16, 17, 18, 19)
        fathersName: user.fathersName,
        fathersOccupation: user.fathersOccupation,
        mothersName: user.mothersName,
        mothersOccupation: user.mothersOccupation,
        
        // Location Information (20, 21, 22)
        residentCountry: user.residentCountry,
        currentCity: user.currentCity,
        hometown: user.hometown,
        
        // Preferences (23, 25)
        interests: user.interests, // array - needs at least 1
        futurePlans: user.futurePlans,
        
        // Photo (26)
        profilePhoto: user.profilePhoto
    };

    // Check required fields
    const missingRequiredFields = [];
    const completedRequiredFields = [];

    Object.keys(requiredFields).forEach(field => {
        const value = requiredFields[field];
        
        // Check if field is empty
        if (!value || 
            (Array.isArray(value) && value.length === 0) || 
            (typeof value === 'string' && value.trim() === '')) {
            missingRequiredFields.push(field);
        } else {
            completedRequiredFields.push(field);
        }
    });

    // Check if all DETAILS are filled (without payment)
    const isDetailsCompleted = missingRequiredFields.length === 0;
    
    // Check payment status
    const isPaymentDone = user.isPaymentDone || false;

    // Calculate completion percentage (INCLUDING payment)
    const totalRequiredFields = Object.keys(requiredFields).length;
    const totalFieldsWithPayment = totalRequiredFields + 1; // +1 for payment
    const completedFieldsCount = completedRequiredFields.length + (isPaymentDone ? 1 : 0);
    const completionPercentage = Math.round((completedFieldsCount / totalFieldsWithPayment) * 100);

    // Profile is complete ONLY if ALL fields are filled AND payment is done
    const isProfileCompleted = isDetailsCompleted && isPaymentDone;

    // Add payment to missing fields if not done
    const allMissingFields = [...missingRequiredFields];
    if (!isPaymentDone) {
        allMissingFields.push('payment');
    }

    // Check section-wise completion
    const sectionCompletion = {
        personal: ['name', 'lastName', 'dateOfBirth', 'gender', 'height', 'phoneNumber', 'foodPreference']
            .every(field => {
                const value = user[field];
                return value && (typeof value !== 'string' || value.trim() !== '');
            }),
        
        professional: ['occupationType', 'occupation', 'education'].every(field => {
                const value = user[field];
                return value && (typeof value !== 'string' || value.trim() !== '');
            }) && user.languagesKnown && user.languagesKnown.length > 0,
        
        family: ['fathersName', 'fathersOccupation', 'mothersName', 'mothersOccupation']
            .every(field => {
                const value = user[field];
                return value && (typeof value !== 'string' || value.trim() !== '');
            }),
        
        location: ['residentCountry', 'currentCity', 'hometown']
            .every(field => {
                const value = user[field];
                return value && (typeof value !== 'string' || value.trim() !== '');
            }),
        
        preferences: user.futurePlans && user.futurePlans.trim() !== '' && 
                     user.interests && user.interests.length > 0,
        
        photo: !!user.profilePhoto,
        
        payment: isPaymentDone  // Add payment section
    };

    // Attach profile completion data to request
    req.profileCompletion = {
        isProfileCompleted,        // true ONLY if details + payment both done
        isDetailsCompleted,        // true if all fields filled (ignoring payment)
        isPaymentDone,             // payment status
        completionPercentage,      // percentage INCLUDING payment (out of 23 total)
        missingRequiredFields: allMissingFields,  // includes 'payment' if not done
        completedRequiredFields,
        sectionCompletion,
        totalFields: totalFieldsWithPayment,     // 23 (22 fields + 1 payment)
        completedFields: completedFieldsCount,
        missingFieldsCount: allMissingFields.length
    };

    // Update user document with completion status if changed
    if (user.isProfileCompleted !== isProfileCompleted) {
        user.isProfileCompleted = isProfileCompleted;
        await user.save();
    }

    next();
});

export { isProfileCompleted };
