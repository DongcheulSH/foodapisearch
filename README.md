# foodapisearch
사용자가 입력한 값으로 식품 함량정보와 이미지를 가져온다

1. 구상  
1.1 블로그 왼쪽에 식품 api 달기  
1.2 게시글로 식품 api 설명 남기기  

2. 설계  
2.1 식품 데이터 가공 설계  
1) 식품 데이터 요청 주소  : http://openapi.foodsafetykorea.go.kr/api/인증키/서비스명/요청파일타입/요청시작위치/요청종료위치  
	샘플 : http://openapi.foodsafetykorea.go.kr/api/sample/I2790/xml/1/5/DESC_KOR=값 &RESEARCH_YEAR=값 &MAKER_NAME=값 &FOOD_CD=값 &CHNG_DT=값  
	이용 : http://openapi.foodsafetykorea.go.kr/api/인증키/I2790/json/1/5/DESC_KOR=몬스터  
2) 결과 json 에서 추출할 값 :	{"I2790" :   
				{"total_count" : 총갯수    
				"row" :	[	{ "NUTR_CONT1" : "열량(kcal)(1회제공량당)"  
						 "NUTR_CONT2" : "탄수화물(g)(1회제공량당)"  
						"DESC_KOR" : "식품이름"  
						"SERVING_SIZE" : 1회제공량  
						"SUB_REF_NAME" : "자료출처('년도)"  
						"MAKER_NAME" : "제조사명"  
						},  
						{ },{ }...   
					]  
				"RESULT": {  
            					"MSG": "정상처리되었습니다.",  
           					 "CODE": "INFO-000"  
       				 	}  
				}  
			}  
3) 개발 요구사항   
  (1) 스와이프 기능 추가하여 넘길 수 있게 구현  (  슬릭으로 구현 )  
  (2) 버튼 누를때 경고창 :  텍스트 박스 비어있을 경우 , 결과가 20개 이상일 경우 , 결과가 0 개 일경우   
      http status 오류 일 경우 , api 내부정의 케이스 반환코드값 일 경우  
  (3) api 로 데이터를 받아오는 것 구현    
  (4) api 로 이미지도 받아오는 것 구현  
  (5) 음식검색하면 , 연관된 여러 값들이 발생 -> 연관된 여러 값들마다 이미지를 묶어 줄 필요가 있음  
4) 이미지 가져오기 ( naver search api 이용 )  
  (1) X-Naver-Client-Id{애플리케이션 등록 시 발급받은 client id 값}  
  (2) X-Naver-Client-Secret{애플리케이션 등록 시 발급받은 client secret 값}   
  (3) 검색 url : https://cors-anywhere.herokuapp.com/https://openapi.naver.com/v1/search/image?sort=sim&display=1&query=몬스터에너지  
  (4) CORS 문제 발생으로 , 프록시 서비스 지원하는 https://cors-anywhere.herokuapp.com/ 이용  
  (5) 결과 json 에서 추출할 값 :  
			{"items" :   
				[  
					{ "link" : ~.png 까지만 }   
				]  
			}  
5) 중복된 데이터 제거 알고리즘 구현  
  (1) 필요성 : 식품 api 검색시 , 동일한 명칭의 다른 년도에 파악한 데이터 들이 다중 존재  
  (2) 해결 : 동일한 명칭의 다른 년도에 파악한 데이터 들중 최신 것만 뽑기 (현재)  
7) 문제사항  
  (1) 티스토리에 jquery 적용방법 - https://www.jbfactory.net/10527  
  (2) slick 유명사이트에서 슬라이드 이용하기위해 참고중 - https://kenwheeler.github.io/slick/  
  (3) CORS 문제 발생으로 프록시 서비스 이용  

2.2 css 디자인 설게  
2.3 이미지 설계  
