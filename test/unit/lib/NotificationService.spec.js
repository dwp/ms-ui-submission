const chai = require('chai');
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
const expect = chai.expect;
const sinon = require('sinon');

const NotificationService = require('../../../app/lib/NotificationService');

const NOOP = () => {};

describe('NotificationService', () => {
	describe('constructor()', () => {
		it('should throw a TypeError if serviceUrl is missing', () => {
			expect(() => {
				return new NotificationService();
			}).to.throw(TypeError, 'Service URL is missing');
		});

		it('should not throw when a valid configuration parameters are provided', () => {
			expect(() => {
				return new NotificationService('http://test:8000/v1/');
			}).to.not.throw();
		});
	})

	describe('sendNotification', () => {
		const smsData = {
			"request_type": "SMS",
			"metadata" :{
				"to" : "076786767867",
				"template_id": "NSESA Application recd COVID19"
			},
			"payload": {
				"values": []
			}
		};
		it('should exist', () => {
			expect(Object.getOwnPropertyNames(NotificationService.prototype)).to.contain('sendNotification');
		});

		it('should return a Promise', () => {
			const notificationService = new NotificationService('http://test:8000/v1/');
			expect(notificationService.sendNotification(smsData).catch(NOOP)).to.be.an.instanceOf(Promise);
		});
	})
});
