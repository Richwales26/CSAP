I’ll turn the 50 decisions into a detailed CSAP Product Requirements Document (PRD), preserving your choices and separating agreed requirements from items that still need decisions. It will focus on what CSAP should do, who it serves, how it should behave, and what success looks like—without going into technical specifications.

CSAP — Product Requirements Document

Version 1.0 · Product planning baseline · 13 October 2026

Scope: Product vision, features, user experience, security, privacy, subscriptions, launch, and acceptance criteria.

# **CSAP — Car Security Application**

## **Product Requirements Document (PRD)**

**Version:** 1.0  
**Status:** Initial product requirements baseline  
**Date:** 13 October 2026  
**Product name:** CSAP (Car Security Application)  
**Product category:** Vehicle security and protection application  
**Primary audience:** Individual vehicle owners  
**Target platforms:** Mobile application and web application  
**Product promise:** Simple Vehicle Security. Greater Confidence, More Control.

---

# **1\. Executive Summary**

CSAP is a vehicle security application designed to make protecting a vehicle easier for its owner. It brings compatible vehicle security features, access management, tracking, incident notifications, and emergency support into one application.

CSAP will help owners understand their vehicle's security status, identify suspicious activity, manage authorised users, respond to incidents, and control how their vehicle information is shared.

The product will prioritise simplicity, reliable security information, owner control, privacy, and clear communication. It will aim to support a broad range of markets and vehicles while transparently identifying which features are actually available for each vehicle.

CSAP will offer mobile and web access from launch, a free basic plan and paid Premium subscription, and support for multiple vehicles through plan-based limits.

The product must not promise that every vehicle supports every feature. Vehicle connectivity, remote controls, tracking, accident detection, and emergency-service integration will depend on verified compatibility and available services.

## **1.1 Product vision**

Make vehicle security simple, accessible, and easier to manage for every vehicle owner.

## **1.2 Product mission**

Provide one clear place for owners to monitor compatible vehicle security features, manage access, receive meaningful alerts, and take informed action when something goes wrong.

## **1.3 Core product principles**

1. **Simplicity:** Important features should be easy to understand and use.  
2. **Security first:** Prioritise meaningful protection and reliable incident handling.  
3. **Owner control:** Owners retain control over vehicle access, location sharing, and account settings.  
4. **Privacy by default:** Share only the information needed for a clearly authorised purpose.  
5. **Honest status:** Clearly distinguish active, unavailable, disconnected, and unknown states.  
6. **Useful notifications:** Prioritise important events and minimise unnecessary interruptions.  
7. **Compatibility-led features:** Advertise and activate only capabilities that are supported and verified.  
8. **Safety-conscious behaviour:** Never perform a protective action that creates an unacceptable safety risk.  
9. **Accessible experience:** Use plain language and straightforward guidance.  
10. **Sustainable growth:** Support commercial growth without undermining essential security or user trust.

# **2\. Product Goals and Non-Goals**

## **2.1 Product goals**

CSAP should:

* Bring supported vehicle security features together in one application.  
* Help owners detect and respond to suspicious vehicle activity.  
* Provide live tracking when supported.  
* Allow owners to manage trusted users and revoke access.  
* Provide useful alerts for suspicious activity, vehicle movement, accidents, connectivity issues, and other relevant security events.  
* Provide an SOS experience with emergency-contact notifications and emergency-service integration where supported.  
* Give owners a clear view of available protections and limitations.  
* Reduce false alarms and notification fatigue.  
* Protect location data, account information, and incident records.  
* Support a free entry-level plan and paid Premium subscription.  
* Provide consistent core experiences across mobile and web.  
* Establish measurable indicators of security value, reliability, user satisfaction, and business performance.

## **2.2 Non-goals for the initial release**

The initial release is not intended to provide:

* General vehicle maintenance and servicing management.  
* Fuel consumption, fuel level, battery-range, or routine vehicle-health monitoring.  
* Guaranteed theft prevention or vehicle recovery.  
* Universal compatibility with all vehicle makes, models, or years.  
* Remote control or live tracking for vehicles that lack a supported connection.  
* Automatic immobilisation of a moving vehicle.  
* Facial recognition for sign-in, biometric verification, or account recovery.  
* A general-purpose vehicle ownership or motoring social network.  
* Guaranteed acceptance of incident reports as legal or insurance evidence.

Features outside the agreed security scope should require a separate product decision.

# **3\. Target Users**

## **3.1 Primary users: Individual vehicle owners**

Owners need a simple way to monitor security, understand alerts, manage access, and respond to incidents.

Typical needs include:

* Knowing whether supported security features are active.  
* Checking a vehicle's location when available.  
* Receiving important alerts without being overwhelmed.  
* Controlling which people can access the vehicle or view its location.  
* Understanding what happens during suspected theft or an accident.  
* Knowing when a feature is unavailable.

## **3.2 Secondary users: Trusted users**

Trusted users may include family members or other people authorised by the owner.

They need to understand the access they have been granted and use the authorised features without automatically receiving access to the owner's private account information or location history.

Trusted-user access must be revocable by the owner.

## **3.3 Emergency contacts**

Emergency contacts are people selected by the owner to receive qualifying incident notifications or escalation messages.

They should receive only the information required for the relevant incident and must not automatically gain account or vehicle-control permissions.

## **3.4 Customer support personnel**

Support personnel help with account recovery, billing, compatibility, connection issues, and other product problems.

Support is not an emergency-response service. CSAP must clearly communicate this distinction.

# **4\. Platforms and Product Structure**

## **4.1 Mobile application**

The mobile application will provide access to the main security experience, including:

* Vehicle security dashboard.  
* Available tracking and remote controls.  
* Security alerts and event history.  
* Trusted-user management.  
* SOS and emergency-contact functions.  
* Incident reports.  
* Account, privacy, and notification settings.  
* Subscription management and help.

## **4.2 Web application**

The web application will provide access to the same core account and security experience, subject to the capabilities supported on the user's device and for the relevant vehicle.

Owners should see consistent vehicle status, access permissions, settings, and security history across mobile and web.

Where a feature requires a capability that is unavailable on a particular platform, CSAP must explain the limitation and offer an appropriate alternative.

## **4.3 Cross-platform consistency**

A change made in one platform should be reflected in the other where applicable.

This includes changes to trusted users, vehicle settings, notification preferences, and location-sharing permissions.

CSAP should clearly identify any pending or unsuccessful changes that could affect security.

# **5\. Functional Requirements**

## **5.1 Account creation and onboarding**

**Priority: Must have**

CSAP will use a straightforward onboarding process with quick setup and guided instructions.

Users should be able to:

* Create an account.  
* Complete the required verification steps.  
* Review vehicle compatibility.  
* Connect a supported vehicle.  
* Configure essential security settings.  
* Choose notification preferences.  
* Invite trusted users.  
* Understand which protections are available.

Users should not be forced to complete every optional walkthrough before using the application.

However, CSAP must not present an essential security feature as ready for use until its required setup and availability have been established.

### **Acceptance criteria**

* A new user can understand the main setup steps.  
* Vehicle compatibility is explained before the user relies on a feature.  
* Users are told which essential features remain unconfigured.  
* The user can distinguish optional setup from essential security setup.  
* Failed setup steps include clear guidance.  
* Setup does not claim success when a connection or feature has not been verified.

## **5.2 Vehicle registration and compatibility**

**Priority: Must have**

Owners should be able to add compatible vehicles and understand the features available for each vehicle.

The application should:

* Check compatibility before activation.  
* Explain unavailable features and known limitations.  
* Distinguish between supported, unsupported, and unverified capabilities.  
* Explain any additional requirements for a feature.  
* Allow owners to manage multiple vehicles according to their subscription plan.

CSAP's intended connection approach is to use existing vehicle connectivity where possible, avoiding additional installed hardware as a default requirement.

Bluetooth, radio-frequency connections, and other existing connection methods may support different functions. CSAP must not imply that a nearby connection automatically enables remote access, continuous tracking, or accident detection.

### **Acceptance criteria**

* Each registered vehicle has a clear compatibility status.  
* Each security feature has an understandable availability status.  
* Unsupported features are not represented as active.  
* The owner receives clear guidance when additional connectivity or a supported vehicle integration is required.  
* The application explains what still works when a connection is lost.

## **5.3 Vehicle security dashboard**

**Priority: Must have**

The dashboard will provide a concise overview of each vehicle's security status.

It should show, where available:

* Current security status.  
* Enabled and disabled security features.  
* Connection status.  
* Recent important events.  
* Available tracking information.  
* Outstanding alerts or actions.  
* Relevant protection gaps.  
* Recommended next steps.

The dashboard should include a simple risk indicator using low, medium, and high categories when sufficient information exists.

Each risk rating must explain the factors that influenced it. If information is insufficient, the application must say so rather than present an unsupported rating.

### **Acceptance criteria**

* Owners can identify the most important security information quickly.  
* Unavailable features are visibly distinguished from active features.  
* Risk indicators include an understandable explanation.  
* The dashboard does not guarantee that a vehicle is safe or theft-proof.  
* Recommendations reflect the vehicle's actual supported capabilities.

## **5.4 Remote vehicle security controls**

**Priority: Must have where compatible**

CSAP will provide remote security controls for supported vehicles, including locking and unlocking where the vehicle and integration permit.

Owners should be able to activate or deactivate supported security features and understand the result.

CSAP must:

* Verify whether a requested action is supported.  
* Communicate whether an action succeeded, failed, or remains unconfirmed.  
* Explain relevant safety restrictions.  
* Prevent the interface from implying that a command succeeded when its outcome is unknown.  
* Apply appropriate safeguards to sensitive actions.

Vehicle immobilisation or similar high-impact actions must not be performed in a way that creates an unacceptable danger, including disabling a moving vehicle.

### **Acceptance criteria**

* Only supported controls are offered as available actions.  
* The outcome of a control request is communicated honestly.  
* Failed or unconfirmed actions are clearly identified.  
* Safety-sensitive actions include appropriate safeguards.  
* Owners are not given false reassurance after an unsuccessful command.

## **5.5 Security modes and automation**

**Priority: Must have for supported modes; automation subject to capability**

CSAP will support straightforward security modes using available vehicle features.

The initial proposed modes are:

* **Everyday:** Normal security settings for routine use.  
* **Enhanced Protection:** Increased protection using available compatible features.  
* **Suspected Theft:** A focused response to possible theft or unauthorised movement.

Owners should be able to activate or deactivate supported protections and choose situation-based modes.

Custom automation should allow owners to define rules for switching modes based on supported events and preferences.

For example, a reliable indication that a vehicle has been parked could trigger Enhanced Protection if the vehicle integration supports that event.

### **Requirements**

* Explain which features each mode uses.  
* Identify any unavailable component of a mode.  
* Let owners review and change their preferences.  
* Avoid repetitive notifications for routine mode changes.  
* Notify owners when an important automated action fails or protection is unavailable.  
* Avoid automation that creates unsafe vehicle behaviour.

## **5.6 Live tracking and location history**

**Priority: Must have where supported**

CSAP should provide live vehicle tracking when the vehicle and connection support it.

Location history may be provided where available and must be governed by the owner's privacy permissions and applicable subscription entitlement.

The interface must distinguish between:

* Current, verified location.  
* Last-known location and its timestamp.  
* Unavailable location.  
* Unknown or unverified location status.

CSAP must not present a last-known location as the vehicle's current location.

### **Acceptance criteria**

* Tracking availability is visible to the owner.  
* Stale location information is clearly labelled.  
* Connection failures do not create a false impression of live tracking.  
* Location access follows the owner's permissions.  
* Any location-history entitlement is explained clearly.

## **5.7 Trusted-user management**

**Priority: Must have**

Owners should be able to invite trusted users, view who is authorised, and revoke access.

The initial product will provide basic user management rather than an advanced role-management system.

Requirements:

* Owners can invite trusted users.  
* Owners can review the authorised-user list.  
* Owners can revoke access.  
* Access changes are communicated clearly.  
* Vehicle-control permissions do not automatically grant access to private account information or location history.  
* Revocation should apply across relevant supported platforms and integrations, subject to clearly disclosed limitations.

Trusted users should not need to buy a separate subscription merely to use access granted under an eligible owner's plan, subject to the selected plan's terms.

## **5.8 Owner-controlled location privacy**

**Priority: Must have**

Location access belongs to the owner by default.

The owner should explicitly grant location access to trusted users and be able to review or revoke those permissions.

Requirements:

* Vehicle access does not automatically confer location access.  
* Location-sharing permissions are understandable and separate from general vehicle access.  
* Temporary incident sharing is available for selected incidents.  
* The owner chooses the recipient and information to share.  
* Temporary sharing expires automatically after its defined period.  
* The owner can end sharing early.  
* Sharing does not automatically grant vehicle-control or account-management access.

## **5.9 Security alerts and notifications**

**Priority: Must have**

CSAP will provide SMS and email notifications for important events, with appropriate in-app notification support.

Events may include:

* Suspicious vehicle activity.  
* Relevant vehicle movement.  
* Authorised-access activity where configured.  
* Completed or failed security actions.  
* Accident alerts where supported.  
* SOS events.  
* Connectivity loss and restoration where detectable.  
* Significant account or access changes.  
* Serious service incidents affecting protection.

The notification system must prioritise useful information rather than simply maximising notification volume.

### **Alert-management requirements**

* Prioritise urgent and meaningful events.  
* Group routine notifications where appropriate.  
* Suppress duplicate alerts unless there is a material change.  
* Respect owner preferences for routine notifications.  
* Preserve important safety and security warnings.  
* Avoid suppressing a genuinely new or serious threat because a similar alert was dismissed.  
* Distinguish suspected incidents from confirmed incidents.  
* Communicate when an alert could not be delivered or when delivery cannot be confirmed, where that information is available.

## **5.10 Suspicious activity and theft response**

**Priority: Must have where supported**

When CSAP identifies suspicious activity, it should alert the owner and initiate appropriate protective guidance.

Depending on available vehicle capabilities, CSAP may:

* Increase monitoring or tracking.  
* Provide relevant event details.  
* Recommend protective actions.  
* Offer owner-approved security actions.  
* Guide the owner through reporting a suspected theft.  
* Help the owner prepare and share available incident information.

The system should distinguish suspected theft from confirmed theft and must not claim that a vehicle has been recovered or authorities have been notified unless that result has been verified.

Protective actions must remain subject to safety requirements.

## **5.11 Accident alerts and emergency response**

**Priority: Must have where supported**

CSAP should provide accident alerts when the vehicle integration supports sufficiently reliable accident information.

The response should:

* Notify the owner through available channels.  
* Include available location information and its freshness.  
* Distinguish suspected from confirmed accident information.  
* Offer a clear safety check or next step where appropriate.  
* Provide a clear route to contacting emergency services.  
* Notify designated emergency contacts when the incident meets the configured criteria.  
* Avoid claiming that an emergency service has been contacted unless that contact is confirmed.

Direct emergency-service integration should be offered only in markets and circumstances where it is actually supported.

## **5.12 SOS and emergency contacts**

**Priority: Must have**

CSAP will provide an SOS experience with emergency-contact alerts and emergency-service integration where supported.

The SOS experience should:

* Be easy to locate and understand.  
* Explain what happens when the user activates it.  
* Share relevant location information where available and authorised.  
* Notify selected emergency contacts.  
* Clearly state whether a request or notification was successfully sent, failed, or remains unconfirmed.  
* Provide a clear alternative for contacting emergency services directly.  
* Avoid presenting CSAP itself as an emergency service.

Emergency escalation must be designed carefully to prevent accidental alerts while preserving accessibility during a genuine emergency.

## **5.13 Escalation when the owner does not respond**

**Priority: Must have for qualifying incidents**

For qualifying serious incidents, CSAP should support escalation to designated emergency contacts when the owner does not acknowledge the incident within the configured response period.

Requirements:

* Escalation applies only to defined qualifying incidents.  
* Non-response alone is not proof of an emergency.  
* The escalation message should explain that the owner has not acknowledged the alert.  
* Only necessary incident information should be shared.  
* The owner should be able to configure emergency contacts and understand escalation behaviour.  
* Routine notifications must not trigger emergency escalation.

## **5.14 Connectivity and protection-gap alerts**

**Priority: Must have**

CSAP should notify owners when a relevant connection is lost or restored, where the loss or restoration can be detected.

Requirements:

* Explain which functions may be unavailable.  
* Distinguish connection status from actual vehicle-security status.  
* Show last-known information where available and label it clearly.  
* Avoid excessive notifications for brief interruptions.  
* Explain which protections remain available.  
* Identify when the status of a protection feature cannot be confirmed.

## **5.15 Security event history and incident reports**

**Priority: Must have**

CSAP will maintain a security-focused event history and allow owners to generate incident reports from available information.

The event history may include:

* Security alerts.  
* Vehicle movement events.  
* Access events.  
* SOS events.  
* Accident alerts.  
* Relevant connection events.  
* Security actions and their reported outcomes.

Incident reports should organise available timestamps, location records, alerts, and access events into a reviewable and shareable format.

Requirements:

* Distinguish recorded facts from inferred or suspected events.  
* Identify unavailable or incomplete information.  
* Avoid implying that a report is guaranteed to be accepted as official evidence.  
* Allow owners to share reports intentionally.  
* Protect the privacy of trusted users and other individuals.  
* Apply the agreed retention policy to event history and reports.

## **5.16 False-alarm management**

**Priority: Must have**

Owners should be able to review alerts and report suspected false alarms.

CSAP should use feedback to improve alert relevance and prioritisation where appropriate.

Requirements:

* Explain why an alert was raised when that information is available.  
* Let owners mark events as legitimate activity or mistaken alerts.  
* Use feedback cautiously.  
* Do not treat a previous dismissal as proof that a future event is safe.  
* Continue to identify genuinely new or serious threats.  
* Communicate meaningful changes to alert behaviour.

## **5.17 Guided feature walkthroughs**

**Priority: Must have**

CSAP will use interactive walkthroughs to teach users how important security features work.

Priority walkthroughs include:

* Connecting a compatible vehicle.  
* Configuring security modes.  
* Understanding live tracking and location privacy.  
* Managing trusted users.  
* Using SOS and emergency contacts.  
* Reviewing suspected theft alerts.  
* Generating incident reports.

Walkthroughs should use plain language, explain relevant limitations, and allow users to leave and return later.

## **5.18 Account recovery and authentication**

**Priority: Must have**

CSAP will support password-based sign-in with an additional verification code.

Fingerprint authentication may be offered on supported devices.

Facial recognition is explicitly excluded from CSAP's authentication and recovery experience.

Account recovery should support users who forget their password or lose access to their usual verification method.

Requirements:

* Verify the user through an appropriate recovery process.  
* Apply additional safeguards before restoring sensitive vehicle controls or private location access.  
* Notify owners about important account-recovery events.  
* Keep fingerprint authentication optional.  
* Do not require facial recognition.  
* Do not leave owners permanently locked out solely because fingerprint authentication is unavailable.

## **5.19 Account deletion**

**Priority: Must have**

Owners should be able to request account deletion through a controlled and transparent process.

The process should:

* Explain which personal data will be deleted.  
* Identify information that may need to be retained for legal or legitimate documented obligations.  
* Revoke trusted-user access as appropriate.  
* Disconnect supported vehicle integrations where possible.  
* Delete eligible data securely according to a clearly communicated schedule.  
* Confirm receipt and completion of the deletion request.  
* Explain any exceptions or unsuccessful disconnections.

## **5.20 Vehicle removal and transfer**

**Priority: Must have**

Owners will manually remove a vehicle from their CSAP account before selling or transferring it.

The process should:

* Clearly explain the effect of vehicle removal.  
* Remove the owner's CSAP access to the vehicle.  
* Revoke associated trusted-user access where appropriate.  
* Protect the previous owner's private account and location history.  
* Explain any integrations that could not be disconnected automatically.  
* Allow the new owner to establish their own CSAP account and connect the vehicle, subject to appropriate checks.

Removing a vehicle from CSAP must not be presented as proof that all manufacturer-side or vehicle-side access has also been removed.

## **5.21 Software updates**

**Priority: Must have**

Owners will decide whether and when to install each application update.

CSAP should provide:

* Clear release notes.  
* Explanations of new features, fixes, and changes.  
* Warnings about updates that address important security vulnerabilities.  
* Information about potential compatibility impacts.  
* Clear disclosure of changes that affect privacy or security behaviour.

CSAP should explain the risks of delaying security updates without falsely claiming that outdated software remains fully protected.

## **5.22 Service-wide incident management**

**Priority: Must have**

When a widespread outage or security issue affects multiple users, CSAP should provide full incident management.

Requirements:

* Identify affected users where reasonably possible.  
* Notify them about relevant impacts.  
* Explain which features are affected and which remain available.  
* Provide practical recovery guidance.  
* Share meaningful progress updates.  
* Confirm restoration only when verified.  
* Provide a post-incident explanation when appropriate.  
* Protect other users' identities and incident information.

## **5.23 Help and customer support**

**Priority: Must have**

CSAP will offer a searchable help centre and email support.

Support topics include:

* Account and recovery problems.  
* Billing and subscription questions.  
* Vehicle compatibility.  
* Connection and feature availability.  
* Security alerts and application behaviour.  
* Privacy and account deletion.

Response expectations should be clearly communicated. Support must not be represented as an emergency-response service.

## **5.24 User feedback**

**Priority: Should have**

CSAP should provide a simple way for users to:

* Rate their experience.  
* Suggest improvements.  
* Report problems.  
* Provide feedback on confusing alerts or false alarms.

Feedback collection should be optional where appropriate and must respect privacy.

# **6\. Subscription and Business Model**

## **6.1 Subscription structure**

CSAP will use a freemium model comprising:

* Free basic plan.  
* Paid Premium subscription.  
* Flexible plan options for individual owners, families, and multiple vehicles.

Exact prices, vehicle limits, and feature entitlements remain to be decided.

## **6.2 Free plan**

The proposed free plan should provide a useful entry-level security experience.

Potential inclusions are:

* One registered vehicle.  
* Essential security notifications.  
* Basic account and trusted-user management.  
* Access to the core dashboard and help resources.

The final entitlement list must be confirmed before launch.

## **6.3 Premium plan**

Premium may include enhanced security and convenience features such as:

* Multiple registered vehicles.  
* Advanced live tracking and location history where supported.  
* Enhanced security monitoring.  
* Custom alerts and automation.  
* Expanded incident-reporting capabilities.

These are proposed entitlements and must be finalised before publication.

## **6.4 Pricing principles**

* Display pricing and plan limits clearly.  
* Explain renewal and cancellation terms.  
* Make plan differences understandable before purchase.  
* Do not use a free-trial expiry model; no free trial is planned.  
* Permit eligible trusted users to use access granted under the owner's plan without buying a separate subscription solely for that access.  
* Provide a published refund policy with case-by-case discretion, while preserving applicable statutory rights.  
* Keep essential safety notifications available without a Premium subscription where feasible and legally appropriate.

# **7\. Privacy and Data Governance**

**Priority: Must have**

CSAP will handle sensitive information, including vehicle location, access events, account details, and potential accident or theft records.

The product must apply privacy protections across all features.

## **7.1 Data minimisation**

Collect and retain only the information needed to deliver the service, protect accounts, handle incidents, and meet documented legal obligations.

## **7.2 Location permissions**

* Owners control location access.  
* Trusted users receive location access only when explicitly authorised.  
* Temporary incident sharing must expire automatically.  
* Permissions can be reviewed and revoked.  
* Access to vehicle controls does not automatically grant access to location data.

## **7.3 Retention and deletion**

CSAP will adopt a balanced retention policy.

It should retain recent security history for a defined period, allow owners to delete eligible data, and separately handle incident reports that owners request to retain.

The final policy must define retention periods, exceptions, and deletion behaviour in accordance with applicable privacy laws.

## **7.4 Transparency**

Users should understand:

* What data is collected.  
* Why it is needed.  
* Who can access it.  
* How long it is retained.  
* How it can be deleted or shared.  
* What data may need to be retained for legal reasons.

# **8\. Accessibility and Language**

**Priority: Must have for clear, usable core experiences**

CSAP will initially launch in one language, which remains to be selected.

The initial experience should use:

* Plain-language alerts.  
* Clear labels and instructions.  
* Readable text.  
* Understandable status indicators.  
* Accessible controls and navigation.  
* Consistent wording across mobile, web, and help content.

Additional languages may be considered after launch.

# **9\. Market Availability and Compatibility**

CSAP will aim for a broad launch across multiple markets rather than a single-market-only release.

However, broad availability does not mean every feature will be available everywhere.

Before offering a capability in a market, CSAP should establish whether relevant vehicle integrations, emergency functionality, support arrangements, and legal requirements permit it.

Requirements:

* Communicate market-specific feature availability.  
* Respect local privacy and consumer-protection requirements.  
* Identify limitations in emergency-service integration.  
* Provide clear support information.  
* Avoid advertising unsupported capabilities.

The launch ambition is broad availability, with feature-level readiness and transparency.

# **10\. Non-Functional Product Requirements**

These requirements describe the expected quality of the product rather than its technical implementation.

## **10.1 Reliability**

* Show the current state of supported features as accurately as possible.  
* Clearly identify uncertain or stale information.  
* Communicate failures that materially affect protection.  
* Avoid claiming that actions succeeded without confirmation.

## **10.2 Usability**

* Make common security tasks easy to locate.  
* Use consistent terminology across mobile and web.  
* Keep essential instructions concise.  
* Avoid unnecessary setup and repeated prompts.  
* Provide guided assistance for unfamiliar or high-impact features.

## **10.3 Security and privacy**

* Protect accounts and sensitive vehicle information.  
* Apply appropriate verification to sensitive actions.  
* Make permissions understandable and revocable.  
* Prevent unauthorised access to location and account data.  
* Communicate important security incidents transparently.

## **10.4 Compatibility**

* Identify supported and unsupported vehicle capabilities.  
* Avoid implying universal compatibility.  
* Explain when a feature depends on an external vehicle service or connection.  
* Clearly communicate the consequences of lost connectivity.

## **10.5 Maintainability and evolution**

* Keep the initial product focused on vehicle security.  
* Evaluate new features against security value, user needs, privacy, reliability, compatibility, accessibility, and commercial sustainability.  
* Avoid introducing new functionality that undermines established security or privacy promises.

# **11\. Product Priorities**

## **Must have**

* Account creation, sign-in, verification, and secure recovery.  
* Vehicle compatibility checks and registration.  
* Core security dashboard and status indicators.  
* Supported security controls and security modes.  
* Important security notifications.  
* Basic trusted-user management.  
* Owner-controlled location permissions.  
* Theft and suspicious-activity response.  
* Accident and SOS experiences where supported.  
* Connectivity and unavailable-feature warnings.  
* Security event history.  
* Account and vehicle removal.  
* Privacy and data-retention policies.  
* Help centre and email support.  
* Mobile and web access to core supported features.

## **Should have**

* Custom security automation.  
* Intelligent alert prioritisation and false-alarm management.  
* Incident report generation and sharing.  
* Temporary incident sharing.  
* Escalation to emergency contacts.  
* Interactive walkthroughs for important features.  
* Flexible subscription plans.  
* User feedback and product-success reporting.  
* Full incident communications for widespread service problems.

## **Later consideration**

* Additional launch languages.  
* Broader market and vehicle-integration coverage.  
* More advanced trusted-user permissions.  
* Further alert-personalisation capabilities.  
* Additional improvements based on measured user needs and security outcomes.

Priorities should be reassessed after compatibility validation and user testing.

# **12\. Success Metrics**

CSAP will measure product success across three agreed categories.

## **12.1 User satisfaction**

Track:

* User ratings.  
* Satisfaction feedback.  
* Reported problems.  
* Recurring complaints about confusing alerts or setup.  
* Support themes that reveal usability problems.

## **12.2 Product usage**

Track:

* Active users.  
* Use of key security features.  
* Completion of essential setup.  
* Retention and engagement.  
* Subscription growth and plan adoption.

## **12.3 Security outcomes**

Track:

* Useful and relevant alerts.  
* False-alarm rates.  
* Successful versus failed security actions.  
* Feature availability and service reliability.  
* Incident handling and response completion.  
* Time taken to communicate meaningful protection failures.

Metrics must be interpreted carefully. A high number of alerts does not necessarily mean better protection, and product usage or subscription growth does not prove that vehicles are safer.

Privacy and reliability should be monitored as safeguards across all three categories. Product measurement should avoid collecting unnecessary personal or location information.

# **13\. Key Risks and Mitigations**

## **13.1 Vehicle incompatibility**

**Risk:** Users expect features that their vehicle cannot support.

**Mitigation:** Verify compatibility before activation and clearly explain unavailable features.

## **13.2 Connectivity limitations**

**Risk:** Owners assume that Bluetooth or radio-frequency connectivity guarantees remote access or live tracking.

**Mitigation:** Explain the capabilities and limitations of each supported connection and distinguish current from last-known information.

## **13.3 False alarms**

**Risk:** Repeated inaccurate alerts reduce trust or cause users to ignore real threats.

**Mitigation:** Prioritise meaningful events, use owner feedback cautiously, and protect alerts for new or serious threats.

## **13.4 Privacy exposure**

**Risk:** Trusted users or a new vehicle owner gain access to private information.

**Mitigation:** Separate vehicle access from location permissions, revoke access appropriately, and protect previous owners' data during vehicle removal.

## **13.5 Emergency-service limitations**

**Risk:** Users believe that CSAP has contacted emergency responders when it has only sent an alert.

**Mitigation:** Clearly distinguish emergency-contact notifications, direct emergency-service integration, and actions that remain the owner's responsibility.

## **13.6 Update delays**

**Risk:** Manual updates leave users exposed to known vulnerabilities.

**Mitigation:** Provide clear release notes and prominent, accurate warnings about important security updates.

## **13.7 Broad launch readiness**

**Risk:** The product is offered in markets where integrations or emergency features are not ready.

**Mitigation:** Pursue broad availability while verifying the readiness of individual capabilities and clearly disclosing limitations.

## **13.8 Notification overload**

**Risk:** Excessive alerts overwhelm owners.

**Mitigation:** Group routine events, suppress duplicates, prioritise urgent incidents, and retain important warnings.

# **14\. Acceptance Criteria for Product Readiness**

Before launch, CSAP should demonstrate that:

1. Users can understand the product's purpose and the limits of its protection.  
2. Vehicle compatibility is explained before users rely on features.  
3. The dashboard accurately distinguishes active, unavailable, and unknown states.  
4. Supported security actions report success, failure, or uncertainty honestly.  
5. Location permissions are owner-controlled and revocable.  
6. Trusted-user access can be reviewed and revoked.  
7. Critical alerts are prioritised without unnecessary notification noise.  
8. SOS and accident experiences accurately communicate what has and has not been sent.  
9. Account recovery does not depend on facial recognition.  
10. Account deletion and vehicle removal explain their effects and limitations.  
11. Privacy, retention, and incident-reporting rules are documented.  
12. Mobile and web provide a consistent core experience.  
13. Subscription terms, feature limits, and refunds are transparent.  
14. Help and support clearly distinguish ordinary assistance from emergency response.  
15. The product can communicate widespread service problems and verified recovery.  
16. Security, usability, compatibility, and privacy have been reviewed before release.

# **15\. Decisions Still Required Before Launch**

The following items need further product, legal, commercial, or compatibility decisions. They are not assumed to be finalised by this PRD.

1. **Initial language and launch markets:** Select the launch language and confirm which markets can be supported.  
2. **Vehicle compatibility:** Define the initial supported vehicle makes, models, model years, and integration capabilities.  
3. **Connection requirements:** Confirm which existing connection methods can support each feature without additional hardware.  
4. **Emergency-service integration:** Determine where direct integration is available and what happens where it is not.  
5. **Subscription details:** Finalise prices, plan names, vehicle limits, feature entitlements, and billing terms.  
6. **Retention periods:** Define the specific retention duration for event history, location records, and incident reports.  
7. **Account recovery:** Finalise acceptable verification and recovery methods when the normal verification channel is unavailable.  
8. **Manual updates:** Define how users will be warned about urgent security updates and how supported versions will be communicated.  
9. **Automation rules:** Define the initial supported triggers, actions, and safeguards.  
10. **Emergency escalation:** Define qualifying incidents, acknowledgement periods, contact-selection rules, and notification wording.  
11. **Risk indicator:** Define the evidence used to assign low, medium, or high risk and when the indicator should be unavailable.  
12. **Refund policy:** Publish the refund process and applicable terms.  
13. **Support commitments:** Establish support hours and realistic response expectations.  
14. **Privacy and legal review:** Confirm applicable data protection, consumer, vehicle-access, and emergency-service requirements.  
15. **Release plan:** Determine launch readiness criteria, rollout sequence, and how initial user feedback will guide improvements.

# **16\. Final Product Definition**

CSAP is a simple vehicle security application for individual vehicle owners. It brings compatible security controls, tracking, access management, alerts, incident reporting, and emergency support together through mobile and web experiences.

It offers a free basic plan and paid Premium options, supports trusted users under owner-controlled permissions, and aims for broad market availability.

Its defining principles are simplicity, honest protection status, owner control, privacy, reliable notifications, and safe incident handling.

**The product's central promise is: Simple Vehicle Security. Greater Confidence, More Control.**

## **Recommended next step**

The PRD is now established as the product-planning baseline. Before moving into technical specifications or development, I recommend producing a prioritised MVP scope and launch checklist from it. This will separate what must be available in the first release from what can follow later, while highlighting the vehicle integrations and emergency capabilities that must be validated before CSAP can make its core promises.

